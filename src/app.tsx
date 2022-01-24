import { h } from 'start-dom-jsx';
import Student from './student.tsx';
import Modal from './Modal.tsx';
import Navbar from './navbar.tsx';
import Model, { Data } from './data.tsx';
import Observable, { observer } from './observable';
import { Event } from './event';
import { Command, Commander } from './command';
const FormRow = ({ label, children }: { label: string; children: JSX.Element[]; }) =>
{
    return (
        <div class='form-row'>
            <label for={ children[0].id }>{ label }</label>
            { children }
        </div>);
}
type Submit = FormData | null;
export class Controller
{
    static data:Submit = null;
    static readonly observable = new Observable();
}
((observer:observer) =>
{
    Controller.observable.addObserver(observer);
    Commander.observable.addObserver(observer);
})((subject:Observable, event:Event) =>
{
    switch (event)
    {
        case Event.INIT:
        {
            document.querySelector('#undo').disabled = !Commander.canUndo();
            document.querySelector('#redo').disabled = !Commander.canRedo();
            break;
        }
        case Event.PAID:
        {
            const { data } = Controller;
            Commander.perform(Command.Pagar(data));
            break;
        }
        case Event.COMMAND:
        {
            document.querySelector('#undo').disabled = !Commander.canUndo();
            document.querySelector('#redo').disabled = !Commander.canRedo();
            break;
        }
        case Event.FORM:
        {
            const { data } = Controller;
            Commander.perform(Command.AgregarEstudiante(data));
            break;
        }
        case Event.REMOVE:
        {
            const { data } = Controller;
            Commander.perform(Command.EliminarEstudiante(data));
            break;
        }
        case Event.REQUEST_EDIT:
        {
            const edit_modal = document.querySelector('#edit-student');
            edit_modal?.classList.toggle('hidden');
            
            const student:Data = Model.data.filter((x:Data) => x.mat === Controller.data?.get('mat'))[0];
            document.querySelector('#edit-nombre-opz').value = student.nombre;
            document.querySelector('#edit-matricula-opz').value = student.mat;
            document.querySelector('#edit-nacimiento-opz').valueAsDate = student.naz;
            document.querySelector('#edit-grupo-opz').value = student.grupo;
            document.querySelector('#edit-pago-opz').value = student.pago.toString();
            document.querySelector('#edit-inicio-opz').valueAsDate = student.inicio;
            break;
        }
        case Event.CHANGED:
        {
            const student:Data = Model.data.filter((x:Data) => x.mat === Controller.data?.get('old-mat'))[0];
            Commander.perform(Command.EditarEstudiante(Controller.data, student));
            break;
        }
    }
});
export default () =>
{
    Model.init();
    return (
        <div id='app'>
            <div id='students' class='card-deck'>
            </div>
            <Modal id='add-student' class='px-12'>
                <form action='#' onSubmit={
                    (e: SubmitEvent) =>
                    {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        console.log('submit')
                        Controller.data = new FormData(form);
                        Controller.observable.notify(Event.FORM);
                        form.reset();
                        document.querySelector('#add-student')?.classList.toggle('hidden');
                    }
                }>
                    <div class='flex items-center justify-center'>
                        <h1 class='text-green-400 font-bold'>AGREGAR ESTUDIANTE</h1>
                    </div>
                    <div class='grid items-center'>
                    <fieldset>
                        <FormRow label='NOMBRE'>
                            <input id='nombre-opz' name='name' type='text' required></input>
                        </FormRow>
                        <FormRow label='MATRÍCULA'>
                            <input id='matricula-opz' name='mat' type='text' pattern='\d*' maxLength={ 6 } minLength={ 6 } required></input>
                        </FormRow>
                        <FormRow label='NACIMIENTO'>
                            <input id='nacimiento-opz' name='naz' type='date' required></input>
                        </FormRow>
                        <FormRow label='GRUPO'>
                            <select id='grupo-opz' name='grupo' required>
                                <option hidden disabled selected value=''>[ GRUPO ]</option>
                                <option value='MAT-1'>MATERNAL 1</option>
                                <option value='MAT-2'>MATERNAL 2</option>
                                <option value='PRE-K'>PRE-KINDER</option>
                                <option value='KIND'>KINDER</option>
                            </select>
                        </FormRow>
                        <FormRow label='PAGO'>
                            <select id='pago-opz' name='pago' required>
                                <option hidden disabled selected value=''>[ $$ ]</option>
                                <option value='55'>55</option>
                                <option value='60'>60</option>
                            </select>
                        </FormRow>
                        <FormRow label='INICIO'>
                            <input id='inicio-opz' name='inicio' type='date' required></input>
                        </FormRow>
                    </fieldset>
                    </div>
                    <fieldset><input type='submit' value='VALE'></input></fieldset>
                </form>
            </Modal>
            <Modal id='edit-student' class='px-12'>
                <form action='#' onSubmit={
                    (e: SubmitEvent) =>
                    {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const mat = Controller.data?.get('mat') as string;
                        Controller.data = new FormData(form);
                        Controller.data.set('old-mat', mat)
                        Controller.observable.notify(Event.CHANGED);
                        form.reset();
                        document.querySelector('#edit-student')?.classList.toggle('hidden');
                    }
                }>
                    <div class='flex items-center justify-center'>
                        <h1 class='text-green-400 font-bold'>EDITAR ESTUDIANTE</h1>
                    </div>
                    <div class='grid items-center'>
                    <fieldset>
                        <FormRow label='NOMBRE'>
                            <input id='edit-nombre-opz' name='name' type='text' required></input>
                        </FormRow>
                        <FormRow label='MATRÍCULA'>
                            <input id='edit-matricula-opz' name='mat' type='text' pattern='\d*' maxLength={ 6 } minLength={ 6 } required></input>
                        </FormRow>
                        <FormRow label='NACIMIENTO'>
                            <input id='edit-nacimiento-opz' name='naz' type='date' required></input>
                        </FormRow>
                        <FormRow label='GRUPO'>
                            <select id='edit-grupo-opz' name='grupo' required>
                                <option hidden disabled selected value=''>[ GRUPO ]</option>
                                <option value='MAT-1'>MATERNAL 1</option>
                                <option value='MAT-2'>MATERNAL 2</option>
                                <option value='PRE-K'>PRE-KINDER</option>
                                <option value='KIND'>KINDER</option>
                            </select>
                        </FormRow>
                        <FormRow label='PAGO'>
                            <select id='edit-pago-opz' name='pago' required>
                                <option hidden disabled selected value=''>[ $$ ]</option>
                                <option value='55'>55</option>
                                <option value='60'>60</option>
                            </select>
                        </FormRow>
                        <FormRow label='INICIO'>
                            <input id='edit-inicio-opz' name='inicio' type='date' required></input>
                        </FormRow>
                    </fieldset>
                    </div>
                    <fieldset><input type='submit' value='VALE'></input></fieldset>
                </form>
            </Modal>
            <Modal id='remove-student' class='px-12'>
                <form action='#' onSubmit={
                    (e: SubmitEvent) =>
                    {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        Controller.data = new FormData(form);
                        Controller.observable.notify(Event.REMOVE);
                        form.reset();
                        document.querySelector('#add-student')?.classList.toggle('hidden');
                    }
                }>
                    <div class='flex items-center justify-center'>
                        <h1 class='text-green-400 font-bold'>ELIMINAR ESTUDIANTE</h1>
                    </div>
                    <div class='grid items-center'>
                    <fieldset>
                        <FormRow label='NOMBRE O MATRÍCULA'>
                            <input type='text' id='rm-id' name='id'></input>
                        </FormRow>
                    </fieldset>
                    </div>
                    <fieldset><input type='submit' value='VALE'></input></fieldset>
                </form>
            </Modal>
            <Navbar links={ [
                [ 'agregar estudiante', () => document.querySelector('#add-student')?.classList.toggle('hidden') ],
                [ 'eliminar estudiante', () =>  document.querySelector('#remove-student')?.classList.toggle('hidden') ],
                [ <span class='fas fa-undo'></span>, () => Commander.undo(), 'undo' ],
                [ <span class='fas fa-redo'></span>, () => Commander.redo(), 'redo' ],
            ] }></Navbar>
        </div>);
}