const projectController = (req, res) => {
    res.status(200).json({
        Message:`hello from ${req.params.id}`
    })
};

module.exports = projectController;
