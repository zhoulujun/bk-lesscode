<template>
    <section class="panel-form-engine">
        <search-box
            placeholder="控件名称"
            :list="searchList"
            @on-change="handleSearch" />
        <section class="materials-container">
            <group-box v-show="widgetList.length !== 1" group-name="设计容器" :list="containerMaterials">
                <render-component :data="containerMaterials[0]" />
            </group-box>
            <formEngineMaterial :list="widgetList" />
        </section>
    </section>
</template>
<script>
    import searchBox from '../common/search-box/index'
    import groupBox from '../common/group-box/index'
    import renderComponent from '../common/group-box/render-component'
    import formEngineMaterial from '@/form-engine/material/index.vue'
    import materials from '@/form-engine/material/materials'

    // 保持formEngine独立性，另单独引入设计容器类
    const CONTAINER_MATERIALS = [
        {
            group: '设计容器',
            icon: 'bk-drag-icon bk-drag-xing-2',
            name: 'form-container',
            type: 'widget-form-container',
            displayName: '表单容器',
            order: 1,
            events: [],
            styles: [
                'size',
                'margin'
            ],
            renderStyles: {
                height: '100%',
                background: '#ffffff'
            },
            props: {}
        }
    ]

    export default {
        name: '',
        components: {
            searchBox,
            groupBox,
            renderComponent,
            formEngineMaterial
        },
        data () {
            return {
                materials,
                searchList: [...CONTAINER_MATERIALS, ...materials],
                widgetList: materials.slice(),
                containerMaterials: CONTAINER_MATERIALS,
            }
        },
        methods: {
            handleSearch (val) {
                if (val) {
                    this.widgetList = val.type === 'widget-form-container' ? [] : [val]
                } else {
                    this.widgetList = this.materials.slice(0)
                }
            }
        }
    }
</script>
<style lang="postcss" scoped>
    @import "@/css/mixins/scroller";

    .panel-form-engine {
        height: 100%;
        .search-box {
            padding: 6px 12px;
        }
        .materials-container {
            height: calc(100% - 44px);
            overflow-y: auto;
            @mixin scroller;
        }
    }
</style>