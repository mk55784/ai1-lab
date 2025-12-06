<?php
namespace App\Model;

use App\Service\Config;

class Post
{
    private ?int $id = null;
    private ?string $make = null;
    private ?string $model = null;
    private ?int $year = null;
    private ?int $price = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getMake(): ?string
    {
        return $this->make;
    }

    public function setMake(?string $make): self
    {
        $this->make = $make;
        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(?string $model): self
    {
        $this->model = $model;
        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): self
    {
        $this->year = $year;
        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(?int $price): self
    {
        $this->price = $price;
        return $this;
    }

    public static function fromArray($array): self
    {
        $post = new self();
        $post->fill($array);
        return $post;
    }

    public function fill($array): self
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['make'])) {
            $this->setMake($array['make']);
        }
        if (isset($array['model'])) {
            $this->setModel($array['model']);
        }
        if (isset($array['year'])) {
            $this->setYear((int)$array['year']);
        }
        if (isset($array['price'])) {
            $this->setPrice((int)$array['price']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $posts = [];
        $postsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($postsArray as $postArray) {
            $posts[] = self::fromArray($postArray);
        }

        return $posts;
    }

    public static function find($id): ?self
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM post WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $postArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $postArray) {
            return null;
        }

        return self::fromArray($postArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO post (make, model, year, price) VALUES (:make, :model, :year, :price)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'make' => $this->getMake(),
                'model' => $this->getModel(),
                'year' => $this->getYear(),
                'price' => $this->getPrice(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE post SET make = :make, model = :model, year = :year, price = :price WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':make' => $this->getMake(),
                ':model' => $this->getModel(),
                ':year' => $this->getYear(),
                ':price' => $this->getPrice(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM post WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([':id' => $this->getId()]);

        $this->setId(null);
    }
}