<?php

namespace App\Model\Table;

use App\Lib\DataUtil;

/**
 * Description of TableUtil
 *
 * @author stephane
 */
class TableUtil {

    public static function multipleWordSearch(&$query, $search, $field, $separator = ' ', $minLength = 1) {
        $search = DataUtil::toLowerString($search);
        $terms = explode($separator, $search);
        $conditions = [
            'AND' => []
        ];
        foreach ($terms as $term) {
            if (strlen($term) >= $minLength) {
                $conditions['AND'][] = [$field . ' LIKE ' => '%' . trim($term) . '%'];
            }
        }
        $query->where([$conditions]);
    }

}
