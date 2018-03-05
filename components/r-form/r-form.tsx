import React, { Component, ReactNode } from "react";
import classNames from "classnames";
import omit from "lodash.omit";
import { Row, Col, Form, Button, Icon } from "antd";
import {
  FormProps,
  WrappedFormUtils,
  GetFieldDecoratorOptions,
  FormComponentProps,
} from "antd/lib/form/Form";
import { FormItemProps } from "antd/lib/form/FormItem";
import { ButtonProps } from "antd/lib/button/button";

export type FormComponentProps = FormComponentProps;

const { Item: FormItem } = Form;

export interface RFormItemProps extends FormItemProps {
  visible?: boolean; // Current form item visibility.
  itemSpan?: number; // ColSpan, default to 8.
  decorate?: boolean; // default to false. If true, "id" is required.
  decoratorOptions?: GetFieldDecoratorOptions; // Only worked when decorator is true.
  control: ReactNode;
}

export interface RFormFooter {
  defaultActionAlign?: "left" | "center" | "right"; // default to "left".
  defaultActionSpan?: number; // span, default to `24`.
  defaultActionOffset?: number; // offset, default to `0`.
  extraAction?: ReactNode;
  showClear?: boolean;
  clearText?: string; // Text of clear button, default to "Clear".
  submitText?: string; // Text of submit button, default to "Submit".
  submitDisabled?: boolean; // default to "false".
  submitExtraProps?: Partial<ButtonProps>;
  showAdvancedToggle?: boolean; // Advanced toggle flag, default to false. You need to use it with "defaultRenderFormItemCount" | "renderFormItemCount".
  advancedToggleTexts?: string[]; // default to ["Expand", "Collapse"]
  onClear?(): void;
  onSubmit(): void;
  onAdvancedToggle?(prevRenderCount?: number): void;
}

export interface RFormProps extends FormProps {
  // form?: WrappedFormUtils;
  background?: "normal";
  header?: ReactNode;
  formItemGutter?: number; // Row gutter, default to 10.
  formItems: RFormItemProps[];
  defaultRenderFormItemCount?: number; // default to 0.
  renderFormItemCount?: number;
  footer?: boolean | RFormFooter;
  onFormChange?(changedFields: any): void; // Only includes decorated form control.
  onValuesChange?(first: [string, any], values: any): void; // Trigger when form item control value changed.
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

    const getRenderCount = ({
      defaultRenderFormItemCount = 0,
      renderFormItemCount,
    }: RFormProps) => {
      if (typeof renderFormItemCount == "number") return renderFormItemCount;
      return defaultRenderFormItemCount;
    };

    this.state = {
      renderCount: getRenderCount(props),
    };
  }

  componentWillReceiveProps({ renderFormItemCount }: RFormProps) {
    if (
      typeof renderFormItemCount == "number" &&
      this.props.renderFormItemCount !== renderFormItemCount &&
      this.state.renderCount !== renderFormItemCount
    ) {
      this.setState({ renderCount: renderFormItemCount });
    }
  }

  onPreClear = () => {
    const { form, footer = {} } = this.props;
    const { resetFields } = form as WrappedFormUtils;
    resetFields();
    const { onClear } = footer as RFormFooter;
    if (typeof onClear != "function") return;
    onClear();
  };

  renderHeader = () => {
    const { header } = this.props;
    if (!header) return null;

    return (
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>{header}</Col>
      </Row>
    );
  };

  renderFormItems = () => {
    const { form, formItems, layout = "horizontal" } = this.props;
    const { getFieldDecorator } = form as WrappedFormUtils;
    const { renderCount } = this.state;

    const DEFAULT_FORMITEM_LAYOUT = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    const formItemLayout = ["vertical", "inline"].includes(layout) ? {} : DEFAULT_FORMITEM_LAYOUT;

    const renderItem = (
      {
        visible = true,
        itemSpan = 8,
        decorate,
        id = "r-form-item-uuid",
        decoratorOptions,
        control,
        ...rest
      }: RFormItemProps,
      i: number
    ) => {
      if (!visible) {
        return null;
      }

      let formItemControl: any = control;
      if (
        formItemControl &&
        typeof formItemControl.type === "function" &&
        !formItemControl.props.size
      ) {
        formItemControl = React.cloneElement(formItemControl, {
          size: "default",
        });
      }
      if (decorate) formItemControl = getFieldDecorator(id, decoratorOptions)(formItemControl);
      return (
        <Col key={i} span={itemSpan}>
          <FormItem {...formItemLayout} {...rest}>
            {formItemControl}
          </FormItem>
        </Col>
      );
    };

    let formItemsToRender = formItems;
    if (renderCount) formItemsToRender = formItems.slice(0, renderCount);

    return formItemsToRender.map(renderItem);
  };

  onPreAdvancedToggle = () => {
    const { defaultRenderFormItemCount = 0, renderFormItemCount, footer = {} } = this.props;
    const { onAdvancedToggle } = footer as RFormFooter;
    const { renderCount = 0 } = this.state;

    if (typeof renderFormItemCount == "number" && typeof onAdvancedToggle == "function") {
      return onAdvancedToggle(renderCount);
    }

    const nextRenderCount = !renderCount ? defaultRenderFormItemCount : 0;
    this.setState({ renderCount: nextRenderCount });
  };

  renderFooter = () => {
    const { footer = false } = this.props;
    if (!footer) return null;
    const { renderCount = 0 } = this.state;

    const {
      defaultActionAlign = "left",
      defaultActionSpan = 24,
      defaultActionOffset = 0,
      extraAction,
      showClear = false,
      clearText = "Clear",
      submitText = "Submit",
      submitDisabled = false,
      submitExtraProps = {},
      showAdvancedToggle = false,
      advancedToggleTexts = ["Expand", "Collapse"],
      onSubmit,
    } = footer as RFormFooter;

    const renderExtra = () => {
      if (!extraAction) return null;

      return <Col span={24 - Number(defaultActionSpan)}>{extraAction}</Col>;
    };

    const renderAdvancedToggle = () => {
      if (!showAdvancedToggle) return null;

      const text = !renderCount ? advancedToggleTexts[1] : advancedToggleTexts[0];
      const iconType = !renderCount ? "up" : "down";

      return (
        <a style={{ letterSpacing: 2 }} onClick={this.onPreAdvancedToggle}>
          {text} <Icon type={iconType} />
        </a>
      );
    };

    const renderClear = () => {
      if (!showClear) return null;

      return (
        <Button style={{ marginRight: 8 }} onClick={this.onPreClear}>
          {clearText}
        </Button>
      );
    };

    return (
      <Row>
        {renderExtra()}
        <Col
          style={{ textAlign: defaultActionAlign }}
          span={Number(defaultActionSpan)}
          offset={Number(defaultActionOffset)}
        >
          {renderClear()}
          <Button type="primary" disabled={submitDisabled} {...submitExtraProps} onClick={onSubmit}>
            {submitText}
          </Button>
        </Col>
        <Col span={24} style={{ textAlign: "center" }}>
          {renderAdvancedToggle()}
        </Col>
      </Row>
    );
  };

  render() {
    const { formItemGutter = 10, background, ...others } = this.props;

    const clazz = classNames({
      "r-antd-r-form_background--normal": background === "normal",
    });

    const rest = omit(others, [
      "form",
      "wrappedComponentRef",
      "header",
      "formItems",
      "defaultRenderFormItemCount",
      "renderFormItemCount",
      "footer",
      "onFormChange",
      "onValuesChange",
    ]);

    return (
      <Form className={clazz} {...rest}>
        {this.renderHeader()}
        <Row gutter={formItemGutter}>{this.renderFormItems()}</Row>
        {this.renderFooter()}
      </Form>
    );
  }
}

const WrappedForm = Form.create<RFormProps>({
  onFieldsChange({ onFormChange }, changedFields: any) {
    if (typeof onFormChange != "function") return;
    onFormChange(changedFields);
  },
  onValuesChange({ onValuesChange }, values: any) {
    if (typeof values != "object") return;
    const [first] = Object.entries(values);
    if (typeof onValuesChange != "function") return;
    onValuesChange(first, values);
  },
})(RForm as any);

export default WrappedForm;
