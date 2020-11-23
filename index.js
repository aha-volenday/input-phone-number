import React, { Component } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import phone from 'phone';
import { Form, Skeleton } from 'antd';

import './styles.css';

const browser = typeof process.browser !== 'undefined' ? process.browser : true;

export default class InputPhoneNumber extends Component {
	state = { code: 'PH', localValue: '' };

	getPhoneNumber = (value, code) => {
		const mobile = phone(value, code);
		return mobile.length ? mobile[0] : value;
	};

	renderInput() {
		const { Input } = require('antd');

		const { code } = this.state;
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
				<div class="col-md-2 col-sm-2 col-2">
					<CountryDropdown
						classes="form-control"
						disabled={disabled}
						onChange={e => this.setState({ code: e })}
						required={required}
						value={code}
						valueType="short"
					/>
				</div>
				<div class="col-md-10 col-sm-8 col-10">
					<Input
						allowClear
						autoComplete="off"
						disabled={disabled}
						name={id}
						placeholder={placeholder || label || id}
						required={required}
						size="large"
						style={styles}
						type="text"
						onBlur={onBlur}
						onChange={e => {
							const mobile = this.getPhoneNumber(e.target.value, code);
							onChange({ target: { name: id, value: mobile } }, id, mobile);
						}}
						onPressEnter={onPressEnter}
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
