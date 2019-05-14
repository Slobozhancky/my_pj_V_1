document.querySelector('.feature-first-item-tabs-header__menu').addEventListener('click', fTabs);
function fTabs(e){
    if(e.target.className == 'feature-first-item-tabs-header__tab'){
        var dataTab = e.target.getAttribute('data-tab');
        var tabBody = document.getElementsByClassName('feature-first-item-tabs-content');
        for (var i = 0; i < tabBody.length; i++){
            if(dataTab == i){
                tabBody[i].style.display = 'block';
            }else{
                tabBody[i].style.display = 'none';
            }
        }
    }
}

$('.testimonials-block-content').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3
});
$('.progress-block-items-content').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3
});
$('.slick-price').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3
});
