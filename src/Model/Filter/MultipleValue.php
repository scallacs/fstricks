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
            if ($this->config('acceptNull')){
                $newConditions = [];
                foreach ($values as $value) {
                    $newConditions[] = [$left => $value];
                }
                $conditions = ['OR' => [$this->config('mode') => $newConditions, $field .' IS NULL']];
            }
            else{
                foreach ($values as $value) {
                    $conditions[] = [$left => $value];
                }
            }
        }
        $this->query()->andWhere([$this->config('mode') => $conditions]);
    }

}
