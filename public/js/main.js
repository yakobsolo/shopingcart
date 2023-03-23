
$('a.confirmDeletion').on('click', () => {
    if (!confirm('confirm deletion')) {
        return false;
    }
    


    // if ($("[data-fancybox]").length) {
    //     $("[data-fancybox]").fancybox();
    // }
})

$("a.grouped_elements").fancybox();