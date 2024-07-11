import { Button } from "flowbite-react";
import Link from "next/link";

export default function NotFound() {
    return(
        <>
            <p>Página não encontrada</p>
            <Button className="w-48" as ={Link} href='/'>Voltar</Button>
        </>
    )
}