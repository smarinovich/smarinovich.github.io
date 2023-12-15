const addProjectInfo = (id) => {
    const index = data.findIndex(i => i.id === id);
    $('#title').text(data[index].title);
    $('#content').text(data[index].description);
    $('#github').text("Github");
    $('#github').attr("href", data[index].github);
    if (data[index].link != "null") {
        $('#link').text("Project Link");
        $('#link').attr("href", data[index].link);
    }
};

$(".project").on("click", function () {
    $('.content').addClass('active');
    const id = parseInt($(this).attr('id'));
    addProjectInfo(id);
    $('#projectMenu').addClass('active');
});

$("#close").on('click', function () {
    // Cancel button will just close the popup:
    $('#projectMenu').removeClass('active');
    $('.content').removeClass('active');
});