'use client'

import NovoTipoCurso from "./novo";
import { TipoCursoContext } from "./context";
import { useEffect, useState } from "react";
import { Table, Button, Spinner } from "flowbite-react";
import { Listar } from "./api";
import { toast } from 'react-toastify';
import RemocaoTipoCurso from "./remocao";
import EdicaoTipoCurso from "./atualizacao";
import { HiPencil, HiTrash } from 'react-icons/hi';

export default function TipoCurso() {

    const [dados, setDados] = useState(null);
    const [atualizar, setAtualizar] = useState(null);
    const [busy, setBusy] = useState(true);
    const [operacao, setOperacao] = useState({ id: null, action: null });

    const atualizarLista = async () => {

        setBusy(p => true);
    
        const resultado = await Listar();
    
        if (resultado.success && resultado.data !== null) {

            let grid = resultado.data.map((p) =>
                <Table.Row key={p.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {p.nome}
                </Table.Cell>                
                <Table.Cell colSpan="2" className="text-right">
                    <div className="flex justify-end space-x-2">
                    <Button size="sm" onClick={() => { setOperacao({ id: p.id, action: 'edit' }) }}>
                        <HiPencil className="h-5 w-5" />
                    </Button>
                    <Button size="sm" color="failure" onClick={() => { setOperacao({ id: p.id, action: 'delete' }) }}>
                        <HiTrash className="h-5 w-5" />
                    </Button>
                    </div>
                </Table.Cell>                
                </Table.Row>
            );
            setDados(grid);
    
            if (resultado.message !== '')
                toast.success(resultado.message);
        }
        else {
            setDados(null);
            if (resultado.message !== '')
                toast.error(resultado.message);
        }
    
        setBusy(p => false);
    }

    let modal = null;

        if (operacao.action === "edit") {
            modal = <EdicaoTipoCurso id={operacao.id} />
        }
        else if (operacao.action === "delete") {
            modal = <RemocaoTipoCurso id={operacao.id}/>
    }

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    useEffect(() => {
        if(atualizar === null)
            setAtualizar(true);
        
        if (atualizar) {
            atualizarLista();
            setAtualizar(p => false);
        }
    }, [atualizar]);

    return (
        <>
            <p className="text-2xl mb-5">Tipos de Curso</p>
            <p className="text-sm mb-5">Aqui serão listados os tipos de curso cadastrados no sistema</p>

            <TipoCursoContext.Provider value={{ atualizar: setAtualizar, fechar: fecharModals }}>
                <NovoTipoCurso />
                {modal}
            </TipoCursoContext.Provider>

            {busy && <Spinner/>}
            {busy || <div className="overflow-x-auto mt-2">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell>Nome</Table.HeadCell>
                    <Table.HeadCell>
                        <span>&nbsp;</span>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <span>&nbsp;</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {dados}
                </Table.Body>
            </Table>
            </div>
            }
        </>
    )
}