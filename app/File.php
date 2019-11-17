<?php

namespace App;

class File /*extends Model*/
{

    public $path = "";
    public $name = "";
    public $text = "";
    public $option = null;

    public function __construct(string $path, string $text = "", $option = null)
    {
        $this->path = $path;
        $this->name = basename($path);
        $this->text = $text;
        $this->option = $option;
    }
}
