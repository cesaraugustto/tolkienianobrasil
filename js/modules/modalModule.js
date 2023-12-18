export function showDescriptionModal(content) {
    const modalId = 'custom-modal';
    const modal = document.createElement('div');
    modal.setAttribute('id', modalId);
    modal.innerHTML = content;
    document.body.appendChild(modal);
  
    $(`#${modalId}`).iziModal({
      headerColor: '#333',
      background: 'rgba(0, 1, 11, 0.7)',
      width: 600,
      padding: 20,
      closeOnEscape: true,
      closeButton: true,
      onClosed: function (modal) {
        // remove from html on close
        modal.destroy();
        $(`#${modalId}`).remove();
      }
    });
    $(`#${modalId}`).css({
      color: '#fff','box-shadow': '0 0 2px rgba(255, 155, 5, 0.7)','border-radius': '10px'
    });
    $(`#${modalId}`).iziModal('open');
  }