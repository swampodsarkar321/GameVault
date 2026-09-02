export function setPageMeta(title: string, description?: string){
  document.title = title + " — GameVault"
  if(description){
    let m = document.querySelector('meta[name="description"]')
    if(m) m.setAttribute("content", description)
  }
}
