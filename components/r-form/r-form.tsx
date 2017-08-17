import React, {
  Component,
  ReactNode,
} from "react";
import omit from "lodash.omit";
import { Row, Col, Form, Button } from "antd";
import { FormProps, WrappedFormUtils, GetFieldDecoratorOptions } from "antd/lib/form/Form";
import { FormItemProps } from "antd/lib/form/FormItem";

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
  onClear?(): void;
  onSubmit(): void;
}

export interface RFormProps extends FormProps {
  // form?: WrappedFormUtils;
  header?: ReactNode;
  formItemGutter?: number; // Row gutter, default as 10.
  formItems: RFormItemProps[];
  footer?: boolean | RFormFooter;
  onFormChange?(changedFields: any): void; // Only includes decorated form control.
}

export class RForm extends Component<RFormProps> {
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

    const DEFAULT_FORMITEM_LAYOUT = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };

    const formItemLayout = ["vertical", "inline"].includes(layout) ? {} : DEFAULT_FORMITEM_LAYOUT;

    const renderItem = ({ itemSpan = 8, decorate, id = "r-form-item-uuid", decoratorOptions, control, ...rest }: RFormItemProps, i: number) => {
      if (decorate) control = getFieldDecorator(id, decoratorOptions)(control);
      return (
        <Col key={i} span={itemSpan}>
          <FormItem
            {...formItemLayout}
            {...rest}
          >
            { control }
          </FormItem>
        </Col>
      );
    };

    return formItems.map(renderItem);
  }

  renderFooter = () => {
    const { footer = false } = this.props;
    if (!footer) return null;

    const {
      defaultActionAlign = "left",
      defaultActionSpan = 24,
      extraAction,
      showClear = false,
      clearText = "Clear",
      submitText = "Submit",
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
