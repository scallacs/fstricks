<?php

namespace App\Test\Util;

/**
 * Description of TableTestCase
 *
 * @author stephane
 */
class TableTestCase extends \Cake\TestSuite\TestCase {

    private function assertEntityHasErrors($entity, $errors, $message = null) {
        foreach ($errors as $name) {
            $this->assertArrayHasKey($name, $entity->errors(), $message . '[' . $name . ']' . ' shoud have an error');
        }
    }

    public function trySavingModel($table, $options) {
        $tableName = '[' . $table->alias() . ']';

        if (!empty($options['edit']) && $options['edit'] !== false) {
            $entity = $table->get($options['edit']);
            $entity = $table->patchEntity($entity, $options['data']);
        } else {
            $entity = $table->newEntity($options['data']);
        }
        if (!empty($options['extra'])) {
            foreach ($options['extra'] as $key => $value) {
                $entity->$key = $value;
            }
        }
//        debug($entity);
        $this->assertEquals($options['success'], (bool) $table->save($entity), (isset($options['message']) ? $options['message'] : '')
                . ' - ' . $tableName . ' should '
                . ($options['success'] ? '' : 'NOT')
                . ' be saved');
        if (!empty($options['errors'])) {
            $this->assertEntityHasErrors($entity, $options['errors'], $options['message'] . ' - ' . $tableName);
        }
        return $entity;
    }

    public function assertValidationErrors($table, $options) {
        $options['success'] = false;
        return $this->trySavingModel($table, $options);
    }

    public function assertSaveModel($table, $options) {
        $tableName = '[' . $table->alias() . ']';
        $options['success'] = true;
        $entity = $this->trySavingModel($table, $options);
        if (!empty($options['compare'])) {
            $entity = $table->get($entity->id);
            foreach ($options['compare'] as $field => $value) {
                $this->assertEquals($value, $entity->$field, $tableName . '[' . $field . '] sould be ' . $value);
            }
        }
    }

}
