'use client'

import { Button, Modal } from "flowbite-react";
import { useContext, useState } from "react"
import { CursoContext } from "./context";
import { Remover } from "./api";
import { toast } from "react-toastify";

export default function RemocaoCurso({ id }) {

    const [modalOpen, setModalOpen] = useState(true);
    const [busy, setBusy] = useState(false);

    const cursoContext = useContext(CursoContext);

    const handleClose = () => {
        setModalOpen(false);
        cursoContext.fechar();
    }

    const handleDelete = async () => {
        setBusy(true);

        const resultado = await Remover(id);

        if (resultado.success) {
            handleClose();
            cursoContext.atualizar(true);
            if (resultado.message !== '')
                toast.success(resultado.message);
        }
        else {
            if (resultado.message !== '')
                toast.error(resultado.message);
        }

        setBusy(p => false);
    }

    return (
        <Modal show={modalOpen} onClose={handleClose}>
            <Modal.Header>Remover de curso</Modal.Header>
            <Modal.Body>
                Deseja realmente remover este curso?
            </Modal.Body>
            <Modal.Footer className="justify-end">
                <Button size="sm" type="button" isProcessing={busy} disabled={busy} onClick={handleDelete}>
                    Remover
                </Button>
                <Button size="sm" color="gray" onClick={handleClose}>
                    Cancelar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}