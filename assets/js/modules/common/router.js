export function loadTemplateById(id) {
    const tpl = document.getElementById(id);
    if (!tpl) {
        console.warn('Template not found:', id);
        return document.createElement('div');
    }
    return tpl.content.cloneNode(true);
}


export function navigateTo(viewId) {
        const app = document.getElementById('app');
        app.innerHTML = '';
        const node = loadTemplateById(viewId);
        app.appendChild(node);
    }