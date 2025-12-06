<?php
/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = "{$post->getMake()} {$post->getModel()}";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $post->getMake() ?> <?= $post->getModel() ?></h1>
    <article>
        <p><strong>Rok produkcji:</strong> <?= $post->getYear() ?></p>
        <p><strong>Cena:</strong> <?= $post->getPrice() ?> PLN</p>
        <p><strong>ID ogłoszenia:</strong> <?= $post->getId() ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('post-index') ?>">Powrót do listy</a></li>
        <li><a href="<?= $router->generatePath('post-edit', ['id'=> $post->getId()]) ?>">Edytuj</a></li>
        <li>
            <a href="<?= $router->generatePath('post-delete', ['id' => $post->getId()]) ?>" onclick="return confirm('Usunąć?')">Usuń</a>
        </li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';