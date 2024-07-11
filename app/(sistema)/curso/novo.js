'use client'

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Label, Modal, Select, TextInput, Textarea } from "flowbite-react"
import { HiPlus } from "react-icons/hi";
import { cursoSchema } from "./schema";
import { CursoContext } from "./context";
import { toast } from "react-toastify";
import { Inserir } from "./api";
import { Listar } from "../tipocurso/api";

export default function NovoCurso() {
    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            nome: '',
            tipoCursoId: ''
        },
        resolver: yupResolver(cursoSchema),
    });

    const fallbackContext = useContext(CursoContext);

    const [tipoCursoList, setTipoCursoList] = useState(null);

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
    }, [modalOpen])

    const onSubmit = async (data) => {
        setBusy(busy => true);
        
        const resultado = await Inserir(data);
console.log(resultado)
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

    const closeModal = () => {
        reset({
            nome: '',
            tipoCursoId: ''
        })
        setModalOpen(false);
    }

    return (
        <>
            <Button gradientMonochrome="cyan" onClick={() => { setModalOpen(true) }}>
                <HiPlus className="mr-1 h-5 w-5" />
                <span>Novo</span>
            </Button>

            <Modal show={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>Novo Curso</Modal.Header>
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
                        <Button size="sm" outline gradientMonochrome="lime" onClick={closeModal}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}