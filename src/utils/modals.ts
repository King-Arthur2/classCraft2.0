import Swal from 'sweetalert2';


export const successModal = (message: string) => {
  Swal.fire({
    icon: 'success',
    iconColor: '#588157',
    title: '¡Éxito!',
    background: '#ebf2fa',
    text: message,
  });
};


export const evaluacionModal = () => {
  Swal.fire({
    title: "¿Estás seguro de comenzar un nivel final?",
    text: "Una vez comenzado ya no podrás volver a intentarlo.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f3de2c",
    cancelButtonColor: "#d33",
    confirmButtonText: "Continuar",
    background: '#2F4F4F',
    iconColor: '#f3de2c',
    color: '#ffffff',
  }).then((result) => {
    if (result.isConfirmed) {
    }
  });
};


