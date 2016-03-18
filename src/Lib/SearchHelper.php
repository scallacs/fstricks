<?php

namespace App\Lib;

/**
 * Description of SearchHelper
 *
 * @author stephane
 */
class SearchHelper {

    private $data;
    private $defaults = [
        'split' => false,
        'type' => 'default',
        'acceptNull' => false
    ];

    public function __construct($data, $query) {
        $this->data = $data;
        $this->query = $query;
    }

    public function optional($name, $field, $options = []) {
        if ($this->has($name)) {
            $this->_generate($name, $field, $options);
        }
        return $this;
    }

    public function required($name, $field, $options = []) {
        if (!$this->has($name)) {
            throw new MissingSearchParams('Required field ' . $name . ' is missing');
        }
        $this->_generate($name, $field, $options);
        return $this;
    }

    public function orders($name, $map) {
        if ($this->has($name)) {
            $v = $this->data[$name];
            if (isset($map[$v])) {
                $this->query->order($map[$v]);
            }
        }
        return $this;
    }

    public function _generate($name, $field, $options) {
        $v = $this->data[$name];
        $options = array_merge($this->defaults, $options);

        $op = '';
        // TODO Check rules
        if ($options['type'] === 'keywords') {
            $this->_keywords($this->data[$name], $field);
        } 
        else { 
            if ($options['split']) {
                $v = explode($options['split'], $v);
                $op = ' IN';
            }

            $c = [$field . $op => $v];
            if ($options['acceptNull']) {
                $c = [
                    'OR' => [[$field . ' IS NULL'], $c]
                ];
            }
            $this->query->where($c);
        }
    }

    public function has($name) {
        return isset($this->data[$name]);
    }

    public function _keywords($search, $field, $separator = ' ', $minLength = 1, $maxWords = 5) {
        $search = DataUtil::toLowerString($search);
        $terms = explode($separator, $search);
        $conditions = [
            'AND' => []
        ];
        $i = 0;
        foreach ($terms as $term) {
            if ($i >= $maxWords){
                break;
            }
            if (strlen($term) >= $minLength) {
                $i++;
                $conditions['AND'][] = [$field .' LIKE ' => '%' . trim($term) . '%'];
            }
        }
//        print_r($conditions);
        $this->query->where([$conditions]);
//        print_r($this->query->sql());
    }

}

class MissingSearchParams extends \Exception {
    
}
