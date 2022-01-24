export const edad = (naz:Date) =>
{
    const hoy = new Date();
    let años = hoy.getFullYear() - naz.getFullYear();
    let meses = hoy.getMonth() - naz.getMonth();
    if (meses < 0)
    {
        meses += 12;
        --años;
    }
    return `${años}a, ${meses}m`;
};