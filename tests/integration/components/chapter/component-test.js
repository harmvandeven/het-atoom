import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | chapter', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Chapter />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Chapter>
        template block text
      </Chapter>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
