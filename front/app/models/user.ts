import { Employee } from './employee';
import { UserEquipment } from './equipment';
import { InternalAvalAnswer } from './internal-aval';

export interface UF {
    id: number;
    descricao: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    adress: string;
    neighborhood: string;
    number: number;
    city: string;
    uf: UF;
    cep: string;
    telephone: string;
    cellphone: string;
    login: string;
    apelido: string;
    ativo: string;
    tipo: string;
    listaTagsLiberadas: UserEquipment[];
    pessoa: Person;
    funcionarioDTO: Employee;
    cliente: Customer;
    foto: string;
    novaSenha: string;
}

export interface Person {
    id: number;
    nome: string;
    sexo: string;
    uf: UF;
    cidade: string;
    endereco: string;
    endereconumero: string;
    bairro: string;
    cep: string;
    tel: string;
    celular: string;
    dataCadastro: Date;
    ativo: string;
    email: string;
    cpf: string;
    estadoCivil: string;
    dataNasc: Date;
    ufNascimento: UF;
    cidadeNascimento: string;
    rg: string;
    orgaoExpedidor: string;
    dataExpedicao: Date;
    ufRg: UF;
    observacoes: string;
    foto: string;
    nacionalidade: string;
    complemento: string;
    assinatura: string;
}

export interface Customer {
    id: number;
    nomefantasia: string;
    razaosocial: string;
    endereco: string;
    telefone: string;
    endereconumero: string;
    cidade: string;
    bairro: string;
    cep: string;
    email: string;
    ativo: string;
    cnpj: string;
    uf: UF;
    dataCadastro: Date;
    responsavel: string;
    apelido: string;
    mesInicio: string;
    contratoFixo: string;
    valorContrato: number;
    listaFuncionariosCliente: EmployeeCustomer[];
    listaEquipamentos: EquipmentCustom[];
}

export interface EmployeeCustomer {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    observacoes: string;
    foto: string;
    usuario: any;
    pessoa?: any;
}

export interface EquipmentCustom {
    idEquipamento: number;
    descricao: string;
    sigla: string;
    classe: string;
    descricaoTag: string;
    descricaoFabricante: string;
    descricaoArea: string;
    idTag: number;
    foto: string;
    grauRiscoPendenciasManutencao: number;
    grauRiscoPendenciasSeguranca: number;
    dataVencimentoPreventiva: Date;
    qtdePecasPendentes: number;
    qtdePrevistas: number;
    qtdeAgendadas: number;
}

export interface CustomerAval {
    id: number;
    resultado: number;
    ordemServico: any;
    dataCadastro: Date;
    observacoes: string;
    usuario: User;
    respostas: InternalAvalAnswer[];
    totalStars: number;
}
