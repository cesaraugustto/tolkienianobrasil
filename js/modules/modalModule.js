//I stopped here on the improvements
export function showModal(content) {
    const modalId = 'custom-modal';
  
    // Criação do modal
    const modal = document.createElement('div');
    modal.setAttribute('id', modalId);
    modal.innerHTML = content;
    document.body.appendChild(modal);
  
    // Configuração e abertura do modal usando a biblioteca IziModal
    $(`#${modalId}`).iziModal({
      headerColor: '#333',
      background: 'rgba(0, 1, 11, 0.7)',
      width: 600,
      padding: 20,
      closeOnEscape: true,
      closeButton: true,
      onClosed: function (modal) {
        // Remover o modal do HTML ao fechar
        modal.destroy();
        $(`#${modalId}`).remove();
      }
    });
    // Aplicar estilos personalizados ao modal
    $(`#${modalId}`).css({
      color: '#fff',    // Definir a cor do texto como branca
      'box-shadow': '0 0 2px rgba(255, 155, 5, 0.7)',   // Simular borda de 0.5px com sombra
      'border-radius': '10px'   // Definir o raio dos cantos arredondados
    });
    $(`#${modalId}`).iziModal('open');
  }