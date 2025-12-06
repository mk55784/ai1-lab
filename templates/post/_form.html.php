<?php
/** @var $post ?\App\Model\Post */
?>

<div class="form-group">
    <label for="make">Marka</label>
    <input type="text" id="make" name="post[make]" value="<?= $post ? $post->getMake() : '' ?>" required>
</div>

<div class="form-group">
    <label for="model">Model</label>
    <input type="text" id="model" name="post[model]" value="<?= $post ? $post->getModel() : '' ?>" required>
</div>

<div class="form-group">
    <label for="year">Rok produkcji</label>
    <input type="number" id="year" name="post[year]" value="<?= $post ? $post->getYear() : '' ?>" required>
</div>

<div class="form-group">
    <label for="price">Cena (PLN)</label>
    <input type="number" id="price" name="post[price]" value="<?= $post ? $post->getPrice() : '' ?>" required>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Zapisz">
</div>