import cloneDeep from 'lodash.clonedeep'
import './index.postcss'

export default {
    name: 'bkform-engine-table',
    props: {
        fieldData: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: Array,
            default: () => []
        },
        disabled: Boolean
    },
    data () {
        return {
            localVal: cloneDeep(this.value)
        }
    },
    watch: {
        value: {
            handler (val) {
                if (val.length === 0) {
                    this.localVal = [this.getDefaultVal()]
                } else {
                    this.localVal = cloneDeep(val)
                }
            },
            deep: true
        }
    },
    created () {
        if (this.value.length === 0) {
            this.localVal = [this.getDefaultVal()]
        }
    },
    methods: {
        getDefaultVal () {
            return this.fieldData.configure.tableConfig.reduce((val, col) => {
                val[col.key] = ''
                return val
            }, {})
        },
        handleAdd (index) {
            this.localVal.splice(index + 1, 0, this.getDefaultVal())
            this.change()
        },
        handleDel (index) {
            this.localVal.splice(index, 1)
            this.change()
        },
        handleCellValChange (index, key, val) {
            this.localVal[index][key] = val
            this.change()
        },
        change () {
            this.$emit('change', this.localVal)
        }
    },
    render (h) {
        const self = this

        const getCellComp = (col, props) => {
            switch (col.type) {
                case 'select':
                case 'multiple-select':
                    return h(
                        'bk-select',
                        {
                            slot: 'default',
                            props: {
                                disabled: col.disabled,
                                value: self.localVal[props.$index][col.key],
                                modelValue: self.localVal[props.$index][col.key]
                            },
                            on: {
                                change: (val) => {
                                    self.handleCellValChange(props.$index, col.key, val)
                                }
                            },
                        },
                        col.dataSource.map(option => h(
                            'bk-option',
                            {
                                props: {
                                    id: option.id,
                                    name: option.label,
                                    label: option.label
                                }
                            }
                        ))
                    )
                case 'date':
                case 'datatime':
                    return h(
                        'bk-date-picker',
                        {
                            slot: 'default',
                            props: {
                                type: col.type,
                                disabled: col.disabled,
                                value: self.localVal[props.$index][col.key],
                                modelValue: self.localVal[props.$index][col.key]
                            },
                            on: {
                                change: (val) => {
                                    self.handleCellValChange(props.$index, col.key, val)
                                }
                            }
                        }
                    )
                default:
                    return h(
                        'bk-input',
                        {
                            slot: 'default',
                            props: {
                                disabled: col.disabled,
                                value: self.localVal[props.$index][col.key],
                                modelValue: self.localVal[props.$index][col.key]
                            },
                            on: {
                                change: (val) => {
                                    self.handleCellValChange(props.$index, col.key, val)
                                }
                            }
                        }
                    )
            }
        }

        const renderCols = () => {
            const cols = this.fieldData.configure.tableConfig.map(col => h(
                'bk-table-column',
                {
                    props: {
                        prop: col.key,
                        label: col.label,
                        index: 999
                    },
                    scopedSlots: {
                        default (props) {
                            return getCellComp(col, props)
                        }
                    }
                }
            ))
            if (!this.disabled || !this.viewMode) {
                cols.push(h(
                    'bk-table-column',
                    {
                        props: {
                            // fixed: 'right'
                            label: '操作',
                            index: 999
                        },
                        scopedSlots: {
                            default (props) {
                                return [
                                    h({
                                        component: 'bk-button',
                                        slot: 'default',
                                        style: { marginRight: '8px' },
                                        props: {
                                            text: true,
                                            theme: 'primary'
                                        },
                                        on: {
                                            click: () => {
                                                self.handleAdd(props.$index)
                                            }
                                        },
                                        children: '添加'
                                    }),
                                    h({
                                        component: 'bk-button',
                                        slot: 'default',
                                        props: {
                                            text: true,
                                            theme: 'primary',
                                            disabled: self.localVal.length === 1
                                        },
                                        on: {
                                            click: () => {
                                                self.handleDel(props.$index)
                                            }
                                        },
                                        children: '删除'
                                    })
                                ]
                            }
                        }
                    }
                ))
            }

            return cols
        }

        return h(
            'bk-table',
            {
                props: {
                    data: self.localVal,
                    disabled: self.disabled,
                    ...self.fieldData.props
                },
            },
            renderCols()
        )
    }
}
