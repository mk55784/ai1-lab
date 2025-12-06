<?php

/** @var \App\Model\Post[] $posts */
/** @var \App\Service\Router $router */

$title = 'Giełda Samochodów';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Lista Samochodów</h1>

    <a href="<?= $router->generatePath('post-create') ?>">Dodaj ogłoszenie</a>

    <ul class="index-list">
        <?php foreach ($posts as $post): ?>
            <li>
                <h3><?= $post->getMake() ?> <?= $post->getModel() ?></h3>
                <p>Rok: <?= $post->getYear() ?> | Cena: <strong><?= $post->getPrice() ?> PLN</strong></p>

                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('post-show', ['id' => $post->getId()]) ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('post-edit', ['id' => $post->getId()]) ?>">Edytuj</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';