import React, {
  Component,
  ReactNode,
} from "react";
import omit from "lodash.omit";
import { Row, Col, Form, Button } from "antd";
import { FormProps, WrappedFormUtils, GetFieldDecoratorOptions, FormComponentProps } from "antd/lib/form/Form";
import { FormItemProps } from "antd/lib/form/FormItem";

export type FormComponentProps = FormComponentProps;

const { Item: FormItem } = Form;

export interface RFormItemProps extends FormItemProps {
  itemSpan?: number; // ColSpan, default as 8.
  decorate?: boolean; // Default as false. If true, "id" is required.
  decoratorOptions?: GetFieldDecoratorOptions; // Only worked when decorator is true.
  control: ReactNode;
}

export interface RFormFooter {
  defaultActionAlign?: "left" | "center" | "right"; // Default as "left".
  defaultActionSpan?: number; // ColSpan, default as 24.
  extraAction?: ReactNode;
  showClear?: boolean;
  clearText?: string; // Text of clear button, default as "Clear".
  submitText?: string; // Text of submit button, default as "Submit".
  showAdvancedToggle?: boolean; // Advanced toggle flag, default as false. You need to use it with "defaultRenderFormItemCount" | "renderFormItemCount".
  advancedToggleTexts?: string[]; // Default as ["Expand", "Collapse"]
  onClear?(): void;
  onSubmit(): void;
  onAdvancedToggle?(prevRenderCount?: number): void;
}

export interface RFormProps extends FormProps {
  // form?: WrappedFormUtils;
  header?: ReactNode;
  formItemGutter?: number; // Row gutter, default as 10.
  formItems: RFormItemProps[];
  defaultRenderFormItemCount?: number; // Default as 0.
  renderFormItemCount?: number;
  footer?: boolean | RFormFooter;
  onFormChange?(changedFields: any): void; // Only includes decorated form control.
}

export interface RFormState {
  renderCount: number;
}

export class RForm extends Component<RFormProps, RFormState> {
  static defaultProps: Partial<RFormProps> = {
    formItemGutter: 10,
    defaultRenderFormItemCount: 0,
  };

  constructor(props: RFormProps) {
    super(props);

    const getRenderCount = ({ defaultRenderFormItemCount = 0, renderFormItemCount }: RFormProps) => {
      if (typeof renderFormItemCount == "number") return renderFormItemCount;
      return defaultRenderFormItemCount;
    };

    this.state = {
      renderCount: getRenderCount(props),
    };
  }

  componentWillReceiveProps({ renderFormItemCount }: RFormProps) {
    if (
      typeof renderFormItemCount == "number"
      && this.props.renderFormItemCount !== renderFormItemCount
      && this.state.renderCount !== renderFormItemCount
    ) {
      this.setState({ renderCount: renderFormItemCount });
    }
  }

  onPreClear = () => {
    const { form, footer = {}, } = this.props;
    const { resetFields } = form as WrappedFormUtils;
    resetFields();
    const { onClear } = footer as RFormFooter;
    if (typeof onClear != "function") return;
    onClear();
  }

  renderHeader = () => {
    const { header } = this.props;
    if (!header) return null;

    return (
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          { header }
        </Col>
      </Row>
    );
  }

  renderFormItems = () => {
    const {
      form,
      formItems,
      layout = "horizontal",
    } = this.props;
    const {
      getFieldDecorator,
    } = form as WrappedFormUtils;
    const {
      renderCount,
    } = this.state;

    const DEFAULT_FORMITEM_LAYOUT = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };

    const formItemLayout = ["vertical", "inline"].includes(layout) ? {} : DEFAULT_FORMITEM_LAYOUT;

    const renderItem = ({ itemSpan = 8, decorate, id = "r-form-item-uuid", decoratorOptions, control, ...rest }: RFormItemProps, i: number) => {
      let formItemControl: any = control;
      if (formItemControl && typeof formItemControl.type === "function" && !formItemControl.props.size) {
        formItemControl = React.cloneElement(formItemControl, { size: "default" });
      }
      if (decorate) formItemControl = getFieldDecorator(id, decoratorOptions)(formItemControl);
      return (
        <Col key={i} span={itemSpan}>
          <FormItem
            {...formItemLayout}
            {...rest}
          >
            { formItemControl }
          </FormItem>
        </Col>
      );
    };

    let formItemsToRender = formItems;
    if (renderCount) formItemsToRender = formItems.slice(0, renderCount);

    return formItemsToRender.map(renderItem);
  }

  onPreAdvancedToggle = () => {
    const {
      defaultRenderFormItemCount = 0,
      renderFormItemCount,
      footer = {},
    } = this.props;
    const {
      onAdvancedToggle,
    } = footer as RFormFooter;
    const {
      renderCount = 0,
    } = this.state;

    if (
      typeof renderFormItemCount == "number"
      && typeof onAdvancedToggle == "function"
    ) {
      return onAdvancedToggle(renderCount);
    }

    const nextRenderCount = !renderCount ? defaultRenderFormItemCount : 0;
    this.setState({ renderCount: nextRenderCount });
  }

  renderFooter = () => {
    const { footer = false } = this.props;
    if (!footer) return null;
    const {
      renderCount = 0,
    } = this.state;

    const {
      defaultActionAlign = "left",
      defaultActionSpan = 24,
      extraAction,
      showClear = false,
      clearText = "Clear",
      submitText = "Submit",
      showAdvancedToggle = false,
      advancedToggleTexts = ["Expand", "Collapse"],
      onSubmit,
    } = footer as RFormFooter;

    const renderExtra = () => {
      if (!extraAction) return null;

      return (
        <Col span={24 - Number(defaultActionSpan)}>
          { extraAction }
        </Col>
      );
    };

    const renderAdvancedToggle = () => {
      if (!showAdvancedToggle) return null;

      const text = !renderCount ? advancedToggleTexts[1] : advancedToggleTexts[0];

      return (
        <a style={{ marginRight: 4 }} onClick={this.onPreAdvancedToggle}>{ text }</a>
      );
    };

    const renderClear = () => {
      if (!showClear) return null;

      return (
        <Button style={{ marginRight: 4 }} onClick={this.onPreClear}>{ clearText }</Button>
      );
    };

    return (
      <Row>
        { renderExtra() }
        <Col style={{ textAlign: defaultActionAlign }} span={Number(defaultActionSpan)}>
          { renderAdvancedToggle() }
          { renderClear() }
          <Button type="primary" onClick={onSubmit}>{ submitText }</Button>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      formItemGutter = 10,
      ...others
    } = this.props;

    const rest = omit(others, [
      "form",
      "wrappedComponentRef",
      "header",
      "formItems",
      "defaultRenderFormItemCount",
      "renderFormItemCount",
      "footer",
      "onFormChange",
    ]);

    return (
      <Form {...rest}>
        { this.renderHeader() }
        <Row gutter={formItemGutter}>
          { this.renderFormItems() }
        </Row>
        { this.renderFooter() }
      </Form>
    );
  }
}

const WrappedForm = Form.create<RFormProps>({
  onFieldsChange({ onFormChange }, changedFields: any) {
    if (typeof onFormChange != "function") return;
    onFormChange(changedFields);
  },
})(RForm as any);

export default WrappedForm;
