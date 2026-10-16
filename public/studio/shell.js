// Sidebar behavior adapted for the uploaded SB Admin layout.
const toggle=document.getElementById('sidebarToggle');
function reflectSidebar(){const open=innerWidth>=992?!document.body.classList.contains('sb-sidenav-toggled'):document.body.classList.contains('sb-sidenav-toggled');toggle.setAttribute('aria-expanded',String(open));document.getElementById('layoutSidenav_nav').inert=!open}
toggle.addEventListener('click',()=>{document.body.classList.toggle('sb-sidenav-toggled');reflectSidebar()});
window.addEventListener('resize',reflectSidebar);reflectSidebar();
document.querySelectorAll('[data-workspace]').forEach(button=>button.addEventListener('click',()=>{document.querySelector(`[data-mode="${button.dataset.workspace}"]`).click();if(innerWidth<992){document.body.classList.remove('sb-sidenav-toggled');reflectSidebar()}}));
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-workspace]').forEach(link=>link.classList.toggle('active',link.dataset.workspace===button.dataset.mode))}));
document.getElementById('sidebarSave').onclick=()=>document.getElementById('saveProject').click();
document.getElementById('sidebarOpen').onclick=()=>document.getElementById('openProject').click();
