<?php

namespace App\Test\Util;

/**
 * Description of TableTestCase
 *
 * @author stephane
 */
class TableTestCase extends \Cake\TestSuite\TestCase {

    /**
     * Assert that the entity provided has errors specifieds in $errors
     * @param \Cake\ORM\Entity $entity
     * @param array $errors
     * @param string $message
     */
    private function assertEntityHasErrors(\Cake\ORM\Entity $entity, array $errors, $message = null) {
        foreach ($errors as $name) {
            $this->assertArrayHasKey($name, $entity->errors(), $message . '[' . $name . ']' . ' shoud have an error');
        }
    }

    /**
     * Try saving the model 
     * @param \Cake\ORM\Table $table
     * @param array $options Accept multiple fields
     *      - 'data': data to save
     *      - 'extra': extra data field set directly without using patch or new entity
     *      - 'edit': boolean true if update, false if insert
     *      - 'success': true if save must be succcess full false, otherwise
     *      - 'errors': validation errors expected
     * @return \Cake\ORM\Entity
     */
    public function trySavingModel(\Cake\ORM\Table $table, array $options) {
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

    /**
     * Assert that saving the data with trigger validation errors
     * @param \Cake\ORM\Table $table
     * @param array $options
     * @return \Cake\ORM\Entity
     */
    public function assertValidationErrors(\Cake\ORM\Table $table, array $options) {
        $options['success'] = false;
        return $this->trySavingModel($table, $options);
    }

    /**
     * Assert that saving the data will be success full and compare values inserted to expected value
     * @param \Cake\ORM\Table $table
     * @param array $options
     *      - compare: array with $field => expected value for the field
     * @return \Cake\ORM\Entity
     */
    public function assertSaveModel(\Cake\ORM\Table $table, array $options) {
        $tableName = '[' . $table->alias() . ']';
        $options['success'] = true;
        $entity = $this->trySavingModel($table, $options);
        if (!empty($options['compare'])) {
            $entity = $table->get($entity->id);
            foreach ($options['compare'] as $field => $value) {
                $this->assertEquals($value, $entity->$field, $tableName . '[' . $field . '] sould be ' . $value);
            }
        }
        return $entity;
    }

}
