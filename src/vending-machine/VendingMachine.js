import { _ } from '../util/util.js';
import VendingMachineView from './VendingMachineView.js';
import ProductModel from './products/ProductModel.js';
import ProductContainerView from './products/ProductContainerView.js'
import ProgressScreenModel from './progress-screen/ProgressScreenModel.js';
import ProgressScreenView from './progress-screen/ProgressScreenView.js';

export default class VendingMachine {
  constructor({URL}) {
    this.productModel;
    this.productContainerView;
    this.progressScreenModel;
    this.progressScreenView;
    this.view;
    this.init(URL);
  }

  init(URL) {
    this.productModel = new ProductModel();
    this.productContainerView = new ProductContainerView(URL, this.productModel);
    this.progressScreenModel = new ProgressScreenModel({ currency: '원' });
    this.progressScreenView = new ProgressScreenView({ model: this.progressScreenModel });
    this.view = new VendingMachineView({
      productContainerView: this.productContainerView,
      progressScreenView: this.progressScreenView
    });

    this.progressScreenModel.subscribeEvent({
      event: 'update-money-sum',
      callback: this.productContainerView.renderAvailable.bind(this.productContainerView)
    });

    this.productModel.subscribeEvent({
      event: 'product-select',
      // callback: this.progressScreenView.onProductSelect.bind(this.progressScreenView)
      callback: this.onProductSelect.bind(this)
    });
  }

  onProductSelect(evt) {
    this.progressScreenModel.reduceMoney(evt.detail.price);
    this.progressScreenModel.appendLog(`${evt.detail.name} 상품이 선택되었습니다.`);
  }

  onUseMoney(evt) {
    this.progressScreenModel.addMoney(evt.detail.money);
    this.progressScreenModel.appendLog(`${money} ${this.currency}이 투입되었습니다.`);
  }

  getViewEl() {
    return this.view.getEl();
  }
}