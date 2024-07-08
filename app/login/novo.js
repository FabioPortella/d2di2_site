'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { novoUsuarioSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Modal, Select, TextInput, Textarea } from "flowbite-react"
import { toast } from "react-toastify";
import { Inserir } from "./api";

const crypto = require('crypto');

function createSHA256Hash(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

export default function NovoUsuario() {

    const [modalOpen, setModalOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            nome: '',
            email: '',
            senha: '',
            tipo: ''
        },
        resolver: yupResolver(novoUsuarioSchema),
    });

    const onSubmit = async (data) => {
        setBusy(busy => true);

        data.senha = createSHA256Hash(data.senha + 'khadfhyf388');
        
        const resultado = await Inserir(data);

        if (resultado.success) {
            closeModal();

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
            email: '',
            senha: '',
            tipo: ''
        })
        setModalOpen(false);
    }

    return (
        <>
            <span className="text-gray-800 dark:text-gray-400 text-sm cursor-pointer" onClick={() => { setModalOpen(true) }}>Clique aqui para registrar um novo usuário</span>

            <Modal show={modalOpen} onClose={closeModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>Novo Usuário</Modal.Header>
                    <Modal.Body>
                        <div className="mb-2">
                            <Label htmlFor="nome">Nome</Label>
                            <TextInput id="nome" placeholder="Informe o nome do usuário" {...register("nome")} />
                            <span className="text-sm text-red-600">{errors?.nome?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="email">E-mail</Label>
                            <TextInput id="email" placeholder="Informe o e-mail do usuário" {...register("email")} />
                            <span className="text-sm text-red-600">{errors?.email?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="senha">Senha</Label>
                            <TextInput id="senha" type="password" placeholder="Informe a senha do usuário" {...register("senha")} />
                            <span className="text-sm text-red-600">{errors?.senha?.message}</span>
                        </div>
                        <div className="mb-2">
                            <Label htmlFor="tipo">Tipo de usuário</Label>
                            <Select id="tipo" {...register("tipo")}>
                                <option value='' key={0} disabled label="<Escolha>" />
                                <option value='1' key={1} label="Administrador" />
                                <option value='2' key={2} label="Padrão" />
                            </Select>
                            <span className="text-sm text-red-600">{errors?.tipo?.message}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-end">
                        <Button size="sm" type="submit" isProcessing={busy} disabled={busy}>
                            Salvar
                        </Button>
                        <Button size="sm" color="gray" onClick={closeModal}>
                            Cancelar
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
} 