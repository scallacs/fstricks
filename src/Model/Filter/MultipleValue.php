<?php

namespace App\Model\Filter;


class MultipleValue extends \Search\Model\Filter\Like {

    /**
     * Process a LIKE condition ($x LIKE $y).
     * Allow multiple values
     *
     * @return void
     */
    public function process() {
        if ($this->skip()) {
            return;
        }
        $values = explode($this->config('delimiter'), $this->value());

        $conditions = [];
        foreach ($this->fields() as $field) {
            $left = $field . ' ' . $this->config('comparison');

            foreach ($values as $value) {
                $right = $this->_wildCards($value);
                $conditions[] = [$left => $right];
            }
        }
        $this->query()->andWhere([$this->config('mode') => $conditions]);
    }

}
