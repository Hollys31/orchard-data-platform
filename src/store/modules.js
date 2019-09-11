import ns from '@/store/constants/ns'
import homeModules from '@/store/modules/homeModules'
import monitorModules from '@/store/modules/monitorModules'
import plantModules from '@/store/modules/plantModules'
import farmingModules from '@/store/modules/farmingModules'
import warehouseModules from '@/store/modules/warehouseModules'
import originModules from '@/store/modules/originModules'
import mapModules from '@/store/modules/mapModules'
import loginModules from '@/store/modules/loginModules'
export default {
    [ns.HOME]: homeModules,
    [ns.MONITOR]: monitorModules,
    [ns.PLANT]: plantModules,
    [ns.FARMING]: farmingModules,
    [ns.WAREHOUSE]: warehouseModules,
    [ns.ORIGIN]: originModules,
    [ns.MAP]: mapModules,
    [ns.LOGIN]: loginModules,
}