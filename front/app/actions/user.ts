'use server';
import xiorInstance from '../api/xior-instance';
import { ProfileFormSchema, profileFormSchema } from '../lib/definitions/profile-form';
import { User } from '../models/user';

export async function updateUser(formData: ProfileFormSchema, userData: User) {
    const validatedFields = profileFormSchema.safeParse({
        nome: formData.nome,
        apelido: formData.apelido,
        email: formData.email,
        endereco: formData.endereco,
        bairro: formData.bairro,
        endereconumero: formData.endereconumero,
        cidade: formData.cidade,
        uf: formData.uf,
        cep: formData.cep,
        tel: formData.tel,
        celular: formData.celular
    });

    const userOBJ = {
        ...userData,
        apelido: validatedFields.data?.apelido,
        pessoa: {
            ...userData.pessoa,
            ...validatedFields.data
        }
    };

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    } else {
        try {
            const { data, error } = await xiorInstance
                .post('data/api/v1/user/update-data', userOBJ)
                .then((res) => res)
                .catch((error) => error);
            return { error, data };
        } catch (error: any) {
            return {
                message: error || error.message || 'Dados inválidos. Por favor, tente novamente.'
            };
        }
    }
}
