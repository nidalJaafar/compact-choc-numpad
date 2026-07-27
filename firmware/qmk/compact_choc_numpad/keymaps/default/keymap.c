#include QMK_KEYBOARD_H

enum layers {
    _BASE,
    _FN,
};

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [_BASE] = LAYOUT_ortho_5x4(
        KC_NUM,  KC_PSLS, KC_PAST, KC_PMNS,
        KC_P7,   KC_P8,   KC_P9,   KC_PPLS,
        KC_P4,   KC_P5,   KC_P6,   KC_PEQL,
        KC_P1,   KC_P2,   KC_P3,   KC_PENT,
        KC_P0,   KC_PDOT, KC_BSPC, MO(_FN)
    ),
    [_FN] = LAYOUT_ortho_5x4(
        QK_BOOT, XXXXXXX, XXXXXXX, XXXXXXX,
        KC_HOME, KC_UP,   KC_PGUP, _______,
        KC_LEFT, XXXXXXX, KC_RGHT, _______,
        KC_END,  KC_DOWN, KC_PGDN, _______,
        _______, KC_DEL,  KC_MUTE, _______
    ),
};

#if defined(ENCODER_MAP_ENABLE)
const uint16_t PROGMEM encoder_map[][NUM_ENCODERS][NUM_DIRECTIONS] = {
    [_BASE] = {ENCODER_CCW_CW(KC_VOLD, KC_VOLU)},
    [_FN]   = {ENCODER_CCW_CW(KC_PGDN, KC_PGUP)},
};
#endif

// The encoder's momentary push switch is wired directly from GP26 to ground.
bool dip_switch_update_user(uint8_t index, bool active) {
    if (index == 0 && active) {
        tap_code16(KC_MUTE);
    }
    return true;
}
