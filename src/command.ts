'use strict';
import { Event } from './event.ts';
import Observable from './observable.ts';
import Model, { Data } from './data.tsx';
export interface command
{
    act: () => void;
    un:  () => void;
}
export const Command = {
    AgregarEstudiante(form: FormData | null)
    {
        const estudiante = {
            nombre: form?.get('name'),
            mat:    form?.get('mat'),
            naz:    new Date(form?.get('naz') as string),
            grupo:  form?.get('grupo'),
            pago:   form?.get('pago') ?? 0,
            pagos:  [],
            inicio: new Date(form?.get('inicio') as string),
        };
        const indice = Model.data.length;
        return {
            act()
            {
                Model.data.splice(indice, 0, estudiante);
                Model.injectView();
                Model.save();
            },
            un()
            {
                Model.data.splice(indice, 1);
                Model.injectView();
                Model.save();
            },
        }
    },
    EditarEstudiante(form: FormData | null, student:Data)
    {
        const old = { ...student };
        const edit = {
            nombre: form?.get('name'),
            mat:    form?.get('mat'),
            naz:    new Date(form?.get('naz') as string),
            grupo:  form?.get('grupo'),
            pago:   form?.get('pago') ?? 0,
            inicio: new Date(form?.get('inicio') as string),
        };
        return {
            act()
            {
                student.nombre = edit.nombre;
                student.mat    = edit.mat;
                student.naz    = edit.naz;
                student.grupo  = edit.grupo;
                student.pago   = edit.pago;
                student.inicio = edit.inicio;
                Model.injectView();
                Model.save();
            },
            un()
            {
                student.nombre = old.nombre;
                student.mat    = old.mat;
                student.naz    = old.naz;
                student.grupo  = old.grupo;
                student.pago   = old.pago;
                student.inicio = old.inicio;
                Model.injectView();
                Model.save();
            },
        }
    },
    EliminarEstudiante(form: FormData | null)
    {
        const id = form?.get('id') ?? '';
        const [ index, student ] = (() =>
        {
            for (let i = 0; i < Model.data.length; ++i)
            {
                const student = Model.data[i];
                if (student.nombre === id || student.mat === id)
                {
                    return [ i, student ];
                    break;
                }
            }
            return [ -1, null ];
        })();
        return {
            act()
            {
                if (index !== -1)
                {
                    Model.data.splice(index, 1);
                }
                Model.injectView();
                Model.save();
            },
            un()
            {
                if (index !== -1)
                {
                    Model.data.splice(index, 0, student);
                }
                Model.injectView();
                Model.save();
            },
        }
    },
    Pagar(form: FormData | null)
    {
        const student:Data = Model.data.filter((x:Data) => x.mat === form?.get('mat'))[0];
        const mes = form?.get('pago');
        let index = student.pagos.length;
        return {
            act()
            {
                student.pagos.splice(index, 0, mes);
                Model.injectView();
                Model.save();
            },
            un()
            {
                student.pagos.splice(index, 1);
                Model.injectView();
                Model.save();
            },
        }
    },
}
export class Commander
{
    private static hot = false
    private static cp = 0
    private static stack:command[] = []
    static readonly observable = new Observable();
    static reset()
    {
        this.cp = 0;
        this.stack.splice(0, this.stack.length);
        return this;
    }
    static perform(command:command)
    {
        this.hot = true;
        this.stack.splice(this.cp, this.stack.length - this.cp);
        this.stack.push(command);
        command.act();
        ++this.cp;
        this.observable.notify(Event.COMMAND);
        return this;
    }
    static undo()
    {
        this.hot = false;
        console.log(this.cp);
        this.stack[--this.cp]?.un();
        this.observable.notify(Event.COMMAND, Event.UNDO);
        return this;
    }
    static redo()
    {
        this.hot = false;
        this.stack[this.cp++]?.act();
        this.observable.notify(Event.COMMAND, Event.REDO);
        return this;
    }
    static canUndo()
    {
        return this.cp > 0;
    }
    static canRedo()
    {
        return this.cp < this.stack.length;
    }
    static isHot()
    {
        return this.hot;
    }
    static stackHeight()
    {
        return this.stack.length;
    }
}