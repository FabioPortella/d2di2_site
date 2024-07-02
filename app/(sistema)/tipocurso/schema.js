import * as yup from "yup"

export const tipoCursoSchema = yup.object({
    nome: yup.string()
        .min(3, 'O nome deve possuir, no mínimo, 3 caracteres')
        .max(100, 'O nome deve possuir, no máximo, 100 caracteres')
        .required('O nome do tipo de curso é obrigatório'),
    descricao: yup.string()
        .min(5, 'A descrição deve possuir, no mínimo, 5 caracteres')
        .max(100, 'A descrição deve possuir, no máximo, 100 caracteres')
        .required('A descrição do tipo de curso é obrigatória')
}).required();