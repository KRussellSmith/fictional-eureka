import { h } from 'start-dom-jsx';
export default ({ children, id, 'class': classes }: { children: JSX.Element[]; id: string; 'class': string; }) =>
{
    const result = (
        <div id={ id } class='hidden fixed left-0 top-0 w-full h-full'>
            <div class='modal-container'>
                <div class={ `${ classes } modal` }>
                    <button class='modal-close' onClick={ () => result.classList.toggle('hidden') }><span class='fas fa-times'></span></button>
                    { children }
                </div>
            </div>
        </div>);
    return result;
}