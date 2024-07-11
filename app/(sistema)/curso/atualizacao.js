'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, TextInput, Textarea } from "flowbite-react"
import { cursoSchema } from "./schema";
import { CursoContext } from "./context";
import { toast } from "react-toastify";
import { Atualizar, Obter } from "./api";
import { Listar } from "../tipocurso/api";

export default function EdicaoCurso({ id }) {
    const [modalOpen, setModalOpen] = useState(true);
    const [busy, setBusy] = useState(false);
    const [primeiroAcesso, setPrimeiroAcesso] = useState(null);
    const [tipoCursoList, setTipoCursoList] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            nome: '',
            tipoCursoId: ''
        },
        resolver: yupResolver(cursoSchema),
    });

    const fallbackContext = useContext(CursoContext);

    const onSubmit = async (data) => {
        setBusy(busy => true);

        data.id = id;
        const resultado = await Atualizar(data);

        if (resultado.success) {
            closeModal();
            fallbackContext.atualizar(true);

            if (resultado.message !== '')
                toast.success(resultado.message);
        }
        else {
            if (resultado.message !== '')
                toast.error(resultado.message);
        }

        setBusy(busy => false);
    }

    const ObterDados = async () => {
        setBusy(true);

        const resultado = await Obter(id);

        if (resultado.success) {
            if (resultado.message !== '')
                toast.success(resultado.message);

            reset({ nome: resultado.data.nome, tipoCursoId: resultado.data.tipoCursoId });
        }
        else {
            if (resultado.message !== '')
                toast.error(resultado.message);
            closeModal();
        }

        setBusy(p => false);
    }

    const atualizarListaTiposCurso = async () => {
        const resultado = await Listar();
        if (resultado.success && resultado.data !== null && resultado.data.length > 0) {
            let grid = resultado.data.map((p) =>
                <option key={p.id} value={p.id}>{p.nome}</option>
            )

            grid.unshift(<option key={0} value=''>[Escolha]</option>)
            setTipoCursoList(grid);
        }
    }

    useEffect(() => {
        if (modalOpen) {
            atualizarListaTiposCurso();
        }
    }, [modalOpen]);

    useEffect(() => {
        if (primeiroAcesso === null)
            setPrimeiroAcesso(true);

        if (primeiroAcesso) {
            setPrimeiroAcesso(false);
            ObterDados();
        }
    }, [primeiroAcesso]);

    const closeModal = () => {
        reset({
            nome: '',
            tipoCursoId: ''
        })
        setModalOpen(false);
        fallbackContext.fechar();
    }

    return (
        <Modal show={modalOpen} onClose={closeModal}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>Edição de Curso</Modal.Header>
                <Modal.Body>
                    <div className="mb-2">
                        <Label htmlFor="nome">Nome</Label>
                        <TextInput id="nome" placeholder="Informe o nome do curso" {...register("nome")} />
                        <span className="text-sm text-red-600">{errors?.nome?.message}</span>
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="tipocurso">Tipo de curso</Label>
                        <Select id="tipocurso" {...register("tipoCursoId")}>
                            {tipoCursoList}
                        </Select>                        
                        <span className="text-sm text-red-600">{errors?.tipoCursoId?.message}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-end">
                    <Button gradientMonochrome="cyan" size="sm" type="submit" isProcessing={busy} disabled={busy}>
                        Salvar
                    </Button>
                    <Button outline gradientMonochrome="lime" size="sm" color="gray" onClick={closeModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}