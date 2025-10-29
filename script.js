$(document).ready(function() {
    let components = {};
    let selectedComponents = {};
    let totalCost = 0;

    // Fetch component data
    $.getJSON('components.json', function(data) {
        components = data.categories;
        renderComponents(components);
    });

    function renderComponents(components) {
        let html = '';
        let imagesHtml = '';
        for (const category in components) {
            html += `<div class="card bg-dark text-white mb-3">
                        <div class="card-header">${category}</div>
                        <div class="card-body">
                            <select class="form-select component-select" data-category="${category}">
                                <option value="">Select ${category}</option>`;
            components[category].forEach(item => {
                html += `<option value="${item.name}" data-price="${item.price}" data-image="${item.image}">${item.name} - $${item.price}</option>`;
            });
            html += `</select>
                        </div>
                    </div>`;
            imagesHtml += `<div class="col-md-6 text-center component-image-container" id="image-container-${category}" style="display:none;">
                               <img src="" class="img-fluid component-image" alt="${category}">
                           </div>`;
        }
        $('#component-options').html(html);
        $('#component-images').html(imagesHtml);
    }

    $(document).on('change', '.component-select', function() {
        const category = $(this).data('category');
        const selectedOption = $(this).find('option:selected');
        const itemName = selectedOption.val();
        const itemPrice = parseFloat(selectedOption.data('price') || 0);
        const itemImage = selectedOption.data('image');

        if (itemName) {
            selectedComponents[category] = { name: itemName, price: itemPrice };
            const imageContainer = $(`#image-container-${category}`);
            const imageElement = imageContainer.find('.component-image');
            imageElement.attr('src', 'assets/' + itemImage);
            imageContainer.hide().fadeIn(500);
        } else {
            delete selectedComponents[category];
            $(`#image-container-${category}`).fadeOut(500);
        }

        updateSummary();
    });

    function updateSummary() {
        let summaryHtml = '';
        totalCost = 0;

        for (const category in selectedComponents) {
            const item = selectedComponents[category];
            summaryHtml += `<div class="d-flex justify-content-between">
                                <span>${category}:</span>
                                <span>${item.name}</span>
                            </div>`;
            totalCost += item.price;
        }

        $('#summary-list').html(summaryHtml);
        $('#total-cost').text(`$${totalCost.toFixed(2)}`);
    }

    $('#save-config').on('click', function() {
        if (Object.keys(selectedComponents).length === 0) {
            alert('Please select at least one component.');
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'save_config.php',
            data: { config: JSON.stringify(selectedComponents) },
            success: function(response) {
                alert(response);
            },
            error: function() {
                alert('Error saving configuration.');
            }
        });
    });

    // Contact form handler
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        $.ajax({
            type: 'POST',
            url: 'save_config.php', // This should ideally be a different file for contact form
            data: form.serialize(),
            success: function(response) {
                $('#form-message').text(response).addClass('text-success');
                form.trigger('reset');
            },
            error: function() {
                $('#form-message').text('Error sending message.').addClass('text-danger');
            }
        });
    });
});