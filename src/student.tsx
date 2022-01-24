import { h } from 'start-dom-jsx';
import Model, { Data } from './data.tsx';
import { edad } from './utiles.ts';
import { Event } from './event';
import { Controller } from './app';
export default ({ nombre, naz, mat, grupo, pago, pagos, inicio }: { nombre: string; naz: Date; mat: string; grupo: string; pago: number; pagos: string[]; inicio: Date; }) =>
{
    console.log(inicio);
    const meses = [
        'ENERO',
        'FEBRERO',
        'MARZO',
        'ABRIL',
        'MAYO',
        'JUNIO',
        'JULIO',
        'AGOSTO',
        'SEPTIEMBRE',
        'OCTUBRE',
        'NOVIEMBRE',
        'DICIEMBRE',
    ];
    const año_inicio = inicio.getFullYear(), mes_inicio = inicio.getMonth();
    const cant_meses = (() =>
    {
        const hoy = new Date();
        let meses = (hoy.getFullYear() - año_inicio) * 12;
        meses += hoy.getMonth() - mes_inicio;
        return meses;
    })();
    const fields = (() =>
    {
        const result = new Array<JSX.Element>();
        const hoy = new Date();
        for (let i = 0, act_mes = mes_inicio, act_año = año_inicio; i <= cant_meses; ++i)
        {
            let paid = (() =>
            {
                const index = `${ act_año }-${ act_mes.toString().padStart(2, '0') }`;
                for (const fecha of pagos)
                {
                    const [ año, mes ] = fecha.split('-').map((x:string) => parseInt(x));
                    if (año === act_año && mes === act_mes)
                    {
                        return true;
                    }
                }
                return false;
            })();
            if (act_mes >= 1)
            {
                const A = act_año, M = act_mes;
                result.push(<div onClick={
                    () =>
                    {
                        Controller.data = new FormData();
                        Controller.data.set('pago', `${ A }-${ M.toString().padStart(2, '0') }`);
                        Controller.data.set('mat', mat);
                        Controller.observable.notify(Event.PAID);
                    }
                } class={ paid ? 'bg-green-400' : 'bg-red-400' }>{ A } - { meses[M] }</div>)
            }
            act_mes++;
            if (act_mes > 11)
            {
                act_mes = 0;
                ++act_año;
            }
        }
        return result;
    })();
    return (
        <div class='card'>
        <div class='w-full px-2 grid grid-cols-6'>
            <div class='col-span-5'><h1 class='font-bold text-green-400'> { nombre }</h1></div>
            <div class='col-start-6'><button class='px-1 text-red-400' onClick={
                () =>
                {
                    Controller.data = new FormData();
                    Controller.data.set('mat', mat);
                    Controller.observable.notify(Event.REQUEST_EDIT);
                }
            }><span class='fas fa-pencil-alt'></span></button></div>
        </div>
            <table>
                <thead>
                </thead>
                <tbody>
                    <tr>
                        <td>EDAD</td>
                        <td>{ edad(naz) }</td>
                    </tr>
                    <tr>
                        <td>MATRÍCULA</td>
                        <td>{ mat }</td>
                    </tr>
                    <tr>
                        <td>GRUPO</td>
                        <td>{ grupo }</td>
                    </tr>
                    <tr>
                        <td>PAGO</td>
                        <td>{ pago }</td>
                    </tr>
                </tbody>
            </table>
                <div class='w-full bg-green-400'>
                    { fields.reverse() }
                </div>
        </div>)
}