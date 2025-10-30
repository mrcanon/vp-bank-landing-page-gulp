(function ($) {
  'use strict';

  // **********************************************************************//
  // ! Validate form
  // **********************************************************************//
  var validateForm = function () {
    var $registerForm = $('#register-form'),
      $btnSubmit = $('#btn-submit');

    // Modal register
    if ($registerForm.length > 0) {
      $registerForm.validate({
        onsubmit: true,
        submitHandler: function(form, event) {
          // Gọi ajax ở đây nếu form được submit
          event.preventDefault();
          $btnSubmit
            .addClass('btn-loading')
            .attr('disable', true)
          var data = {
            company: $('[name="company"]').val(),
            tax: $('[name="tax"]').val(),
            name: $('[name="name"]').val(),
            tel: $('[name="tel"]').val(),
            email: $('[name="email"]').val(),
            package: $('[name="package"]').val(),
            agree: $('[name="agree"]').val()
          }

          $.ajax({
            method: 'POST',
            url: 'https://5ab229de62a6ae001408c204.mockapi.io/register',
            data: data
          })
          .done(function( msg ) {
            console.log( {msg});
          })
          .fail(function(jqXHR, textStatus) {
            console.log( 'Request failed: ' + textStatus );
          })
          .always(function(data, textStatus, jqXHR) {
            $btnSubmit
            .removeClass('btn-loading')
            .attr('disable', false)
          });
        },
        ignore: [],
        errorClass: 'form-error',
        rules: {
          company: {
            required: true
          },
          tax: {
            required: true,
            number: true,
            minlength: 6,
            maxlength: 40
          },
          name: {
            required: true,
            minlength: 6,
            maxlength: 32
          },
          tel: {
            required: true,
            minlength: 10,
            maxlength: 11,
            number: true
          },
          email: {
            required: true,
            email: true
          },
          package: {
            required: true
          },
          agree: {
            required: true
          }
        },
        messages: {
          required: {
            required: 'Vui lòng nhập tên doanh nghiệp'
          },
          tax: {
            required: 'Vui lòng nhập mã số thuế',            
            number: 'Vui lòng chỉ nhập chữ số',
            minlength: 'Số điện thoại tối thiểu 6 chữ số',
            maxlength: 'Số điện thoại tối đa 40 chữ số'
          },
          name: {
            required: 'Vui lòng nhập tên người liên hệ',
            minlength: 'Tên người liên hệ 6 chứ số',
            maxlength: 'Tên người liên hệ 32 chứ số'
          },
          tel: {
            required: 'Vui lòng nhập số điện thoại',
            minlength: 'Số điện thoại tối thiểu 10 chứ số',
            maxlength: 'Số điện thoại tối đa 11 chứ số'
          },
          email: {
            required: 'Vui lòng nhập email',
            email: 'Email không hợp lệ'
          },
          package: {
            required: 'Vui lòng nhập gói hỗ trợ'
          },
          agree: {
            required: 'Vui lòng đồng ý với điều khoản'
          }
        }
      });
    }
  };

  // **********************************************************************//
  // ! window dome ready
  // **********************************************************************//
  $(document).on('ready', function () {
    validateForm();
  });
})(jQuery);
