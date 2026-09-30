import Swal from 'sweetalert2'

export function confirmDialog(message: string, buttonText = 'Sí, eliminar'): Promise<boolean> {
  return Swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: buttonText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
  }).then((result) => result.isConfirmed)
}

export function success(title: string) {
  return Swal.fire({ title, icon: 'success', confirmButtonText: 'Ok' })
}

export function showError(title: string, text?: string) {
  return Swal.fire({ title, text, icon: 'error', confirmButtonText: 'Ok' })
}

export function showInfo(title: string, text?: string) {
  return Swal.fire({ title, text, icon: 'info', confirmButtonText: 'Ok' })
}
