import { h } from 'start-dom-jsx';

type navlink = string | { (): (void | undefined); };

const Link = (text:string, to:navlink, id:string) =>
{
    if (typeof to === 'string')
    {
        return (
            <li class='nav-item nav-link'>
                <a id={ id } href={ to as string }>{ text }</a>
            </li>);
    }
    else
    {
        return (
            <li class='nav-item nav-link'><button id={ id } onClick={ to as { (): undefined; } }>{ text }</button></li>);
    }
}

export default ({ links }: { links: [ string, navlink, string? ][] }) =>
{
    const result = (
        <div class='nav-root'>
            <div class='navbar'>
                <div class='navbar-main'>
                    { links.map((x:[ string, navlink, string? ]) => Link(x[0], x[1], x[2] ?? '')) }
                </div>
            </div>
            <div class='nav-margin'></div>
        </div>);
    return result;
}