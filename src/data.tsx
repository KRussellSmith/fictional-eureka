import { h } from 'start-dom-jsx';
import Student from "./student.tsx";

export interface Data
{
    nombre: string;
    mat:    string;
    naz:    Date;
    grupo:  string;
    pago:   number;
    pagos:  string[];
    inicio: Date;
}
const key = 'caipi-matricula-datos';
export default {
    data: new Array<Data>(),
    convert(data: { nombre: string; mat: string; naz: string; grupo: string, pago: number, pagos: string[]; inicio: string; }[]): Data[]
    {
        const result = new Array<Data>();
        for (const dato of data)
        {
            result.push({
                nombre: dato.nombre ?? '',
                mat:    dato.mat ?? '000000',
                naz:    new Date(dato.naz),
                grupo:  dato.grupo ?? '',
                pago:   dato.pago ?? 0,
                pagos:  dato.pagos ?? [],
                inicio: new Date(dato.inicio),
            });
        }
        return result;
    },
    init()
    {
        //localStorage.removeItem(key)
        this.data = this.convert(JSON.parse(localStorage.getItem(key) ?? '{}')?.estudiantes ?? []);
    },
    save()
    {
        localStorage.setItem(key, JSON.stringify({
            estudiantes: this.data
        }));
    },
    injectView()
    {
        document.querySelector('#students')?.replaceChildren(
            ...(this.data.map(
                (x:Data) =>
                    (<Student nombre={ x.nombre } mat={ x.mat } naz={ x.naz } grupo={ x.grupo } pago={ x.pago } pagos={ x.pagos } inicio={ x.inicio }></Student>))));
    },
}