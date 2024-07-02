import * as yup from "yup"

export const cursoSchema = yup.object({
    nome: yup.string()
        .min(3, 'O nome deve possuir, no mínimo, 3 caracteres')
        .max(100, 'O nome deve possuir, no máximo, 100 caracteres')
        .required('O nome do curso é obrigatório'),
    tipoCursoId: yup.number()
        .typeError('O tipo de curso é obrigatório')
        .required('O tipo de curso é obrigatório')
}).required();