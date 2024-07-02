'use client'

import { useEffect, useState } from "react";
import { CursoContext } from "./context";
import NovoCurso from "./novo";
import { Button, Spinner, Table } from "flowbite-react";
import { Listar } from "./api";
import RemocaoCurso from "./remocao";
import EdicaoCurso from "./atualizacao";

export default function Curso() {

    const [atualizar, setAtualizar] = useState(null);
    const [dados, setDados] = useState(null);
    const [busy, setBusy] = useState(false);
    const [operacao, setOperacao] = useState({ id: null, action: null });

    const atualizarLista = async () => {

        setBusy(p => true);

        const resultado = await Listar();

        if (resultado.success && resultado.data !== null) {
            let grid = resultado.data.map((p) =>
                <Table.Row key={p.id}>
                    <Table.Cell>{p.nome}</Table.Cell>
                    <Table.Cell>{p.tipoDoCurso.nome}</Table.Cell>
                    <Table.Cell>
                        <Button size="sm" onClick={() => { setOperacao({ id: p.id, action: 'edit' }) }}>Editar</Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button size="sm" color="failure" onClick={() => { setOperacao({ id: p.id, action: 'delete' }) }}>Remover</Button>
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

    useEffect(() => {
        if (atualizar === null)
            setAtualizar(true);

        if (atualizar) {
            atualizarLista();
            setAtualizar(p => false);
        }
    }, [atualizar]);

    const fecharModals = () => {
        setOperacao({ id: null, action: null });
    }

    let modal = null;

    if (operacao.action === "edit") {
        modal = <EdicaoCurso id={operacao.id}/>
    }
    else if (operacao.action === "delete") {
        modal = <RemocaoCurso id={operacao.id}/>
    }

    return (
        <>
            <p className="text-2xl">Cursos</p>
            <p className="text-sm">Aqui serão listados os cursos cadastrados no sistema</p>

            <CursoContext.Provider value={{ atualizar: setAtualizar, fechar: fecharModals }}>
                <NovoCurso />
                {modal}
            </CursoContext.Provider>

            {busy && <Spinner />}

            <div className="mt-2">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Nome</Table.HeadCell>
                        <Table.HeadCell>Tipo</Table.HeadCell>
                        <Table.HeadCell>
                            <span>&nbsp;</span>
                        </Table.HeadCell>
                        <Table.HeadCell>
                            <span>&nbsp;</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {dados}
                    </Table.Body>
                </Table>
            </div>
        </>
    )
}