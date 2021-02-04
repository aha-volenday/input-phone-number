import React, { Component } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { Form, Skeleton } from 'antd';

import './styles.css';

const browser = typeof process.browser !== 'undefined' ? process.browser : true;

export default class InputPhoneNumber extends Component {
	renderInput() {
		const {
			disabled = false,
			id,
			label = '',
			onBlur = () => {},
			onChange,
			onPressEnter = () => {},
			placeholder = '',
			required = false,
			styles = {},
			value = ''
		} = this.props;

		return (
			<div class="row">
				<div class="col-md-12 col-sm-10 col-10">
					<PhoneInput
						autoComplete="off"
						country="ph"
						disabled={disabled}
						enableSearch={true}
						inputStyle={{ width: '100%' }}
						name={id}
						onBlur={onBlur}
						onChange={phone => {
							onChange({ target: { name: id, value: phone } }, id, phone);
						}}
						onPressEnter={onPressEnter}
						placeholder={placeholder || label || id}
						required={required}
						searchPlaceholder="Search country"
						value={value ? value : ''}
					/>
				</div>
			</div>
		);
	}

	render() {
		const { extra = null, label = '', required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			label: withLabel ? (
				<>
					<div style={{ float: 'right' }}>{extra}</div> <span class="label">{label}</span>
				</>
			) : (
				false
			),
			required
		};

		return (
			<Form.Item {...formItemCommonProps}>
				{browser ? (
					this.renderInput()
				) : (
					<Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />
				)}
			</Form.Item>
		);
	}
}
