<template>
    <div class="page-setting-modifier">
        <div class="setting-type">
            <select-tab :tab-list="typeList" :active-item="activeType" :item-change="handleChangeType" />
        </div>
        <div>
            <page-setting v-if="activeType === 'pageSetting'"></page-setting>
            <page-func v-else></page-func>
        </div>
    </div>
</template>

<script>
    import SelectTab from '@/components/ui/select-tab'
    import PageSetting from './components/page-setting'
    import PageFunc from './components/page-func'
    import { defineComponent, ref } from '@vue/composition-api'

    export default defineComponent({
        components: {
            SelectTab,
            PageSetting,
            PageFunc
        },
        setup () {
            const typeList = [
                {
                    id: 'pageSetting',
                    name: window.i18n.t('页面配置')
                },
                {
                    id: 'pageFunc',
                    name: window.i18n.t('页面函数')
                }
            ]
            const activeType = ref('pageSetting')

            function handleChangeType (type) {
                activeType.value = type
            }

            return {
                typeList,
                activeType,
                handleChangeType
            }
        }
    })
</script>

<style lang="postcss" scoped>
    @import "@/css/variable";
    @import "@/css/mixins/scroller";

    .page-setting-modifier {
        height: 100%;
        background: #fff;
        overflow: hidden;
        .setting-type {
            padding: 8px 12px;
        }
    }
    .page-setting-container {
        height: calc(100vh - 104px - 42px);
        overflow-y: auto;
        @mixin scroller;
        font-size: 12px;
        .field-display-name {
            cursor: pointer;
            border-bottom: 1px dashed #999;
        }
    }
</style>
