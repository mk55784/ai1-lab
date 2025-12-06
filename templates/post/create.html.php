<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = 'Dodaj Samochód';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Nowe ogłoszenie</h1>
    <form action="<?= $router->generatePath('post-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="post-create">
    </form>

    <a href="<?= $router->generatePath('post-index') ?>">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';